#!/usr/bin/perl
use Mojolicious::Lite;
use Mojo::JSON qw(decode_json encode_json);
use Time::Piece;

get '/' => sub {
    my $c = shift;
    my $filter;
    {
        open (my $in,"<", "data/filter.json") or die $!;
        local $/ = undef;
        my $data = <$in>;
        $filter = decode_json($data);
    }
    $c->render(json => $filter);
};
post '/' => sub {
    my $c = shift;
    my $update_data = $c->req->json;
    $c->app->log->info("post = " . encode_json($update_data));
    my $filter;
    {
        open (my $in,"<", "data/filter.json") or die $!;
        local $/ = undef;
        my $data = <$in>;
        $filter = decode_json($data);
    }
    if ($update_data->{method} eq "del"){
        my $dst = $update_data->{destination};
        my @new_record;
        for(@{$filter->{$dst}}){
            if ($_->{regex}  eq $update_data->{regex} and
                $_->{header} eq $update_data->{header} and
                $_->{time}   eq $update_data->{time}){
                next;
            }
            push (@new_record, $_);
        }
        @{$filter->{$dst}} = @new_record;
    }
    elsif ($update_data->{method} eq "add"){
        my $dst = $update_data->{destination};
        my $t = localtime;
        push(@{$filter->{$dst}},{
                header => $update_data->{header},
                regex  => $update_data->{regex},
                time   => $t->strftime('%Y/%m/%d %H:%M')
            });
    }
    open (my $wr,">", "data/filter.json") or die $!;
    print $wr encode_json($filter);
    $c->render(text => "OK\n");
};

app->start;
